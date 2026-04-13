<script setup lang="ts">
// (no reactive state needed in this component)
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { AlertTriangle, Plus, Trash2, Wrench } from 'lucide-vue-next';
import { Card, CardContent } from '@/components/ui/card';
import DialogClose from '@/components/ui/dialog/DialogClose.vue';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { onMounted, ref, watch } from 'vue';
import type { Agreement, AgreementSection} from '@/services/agreementService';
import { AgreementService } from '@/services';
import DeleteAlert from '@/components/ui/alert-dialog/DeleteAlert/DeleteAlert.vue'
import { useAuthStore } from '@/stores/auth';
const editMode = ref(false);
const toggleEditMode = () => {
    editMode.value = !editMode.value;
};

type AgreementEditState = {
    agreementId: number;
    isEditing: boolean;
    isBusy: boolean;
    title: string;
    description: string;
};

const agreementEditStates = ref<AgreementEditState[]>([]);

const syncEditStatesFromAgreements = (agreements?: Agreement[]) => {
    const next: AgreementEditState[] = [];
    for (const agreement of agreements ?? []) {
        const previous = agreementEditStates.value.find((s) => s.agreementId === agreement.id);
        if (!previous) {
            next.push({
                agreementId: agreement.id,
                isEditing: false,
                isBusy: false,
                title: agreement.title,
                description: agreement.description,
            });
            continue;
        }

        const cloned: AgreementEditState = { ...previous };
        if (!cloned.isEditing && !cloned.isBusy) {
            cloned.title = agreement.title;
            cloned.description = agreement.description;
        }
        next.push(cloned);
    }
    agreementEditStates.value = next;
};

const getEditState = (agreementId: number) => {
    const state = agreementEditStates.value.find((s) => s.agreementId === agreementId);
    if (state) return state;
    const fallback: AgreementEditState = {
        agreementId,
        isEditing: true,
        isBusy: false,
        title: '',
        description: '',
    };
    agreementEditStates.value.push(fallback);
    return fallback;
};

const isEditingAgreement = (agreementId: number) => {
    return agreementEditStates.value.find((s) => s.agreementId === agreementId)?.isEditing ?? false;
};

const beginEditingAgreement = async (agreementId: number) => {
    if (!editMode.value) return;
    const state = getEditState(agreementId);
    state.isEditing = true;
    state.isBusy = true;
    try {
        const res = await AgreementService.agreements.get(agreementId);
        state.title = res.title;
        state.description = res.description;
    } catch (error) {
        console.error('Failed to load agreement for editing:', error);
    } finally {
        state.isBusy = false;
    }
};

const cancelEditingAgreement = (agreementId: number) => {
    const state = getEditState(agreementId);
    const current = aggreement.value?.agreements?.find((a) => a.id === agreementId);
    state.isEditing = false;
    state.isBusy = false;
    state.title = current?.title ?? '';
    state.description = current?.description ?? '';
};

const saveAgreementEdits = async (agreementId: number) => {
    if (!aggreement.value) return;
    const state = getEditState(agreementId);
    state.isBusy = true;
    try {
        const updated = await AgreementService.agreements.update(agreementId, {
            title: state.title,
            description: state.description,
            agreement_section: aggreement.value.id,
        });

        aggreement.value.agreements = (aggreement.value.agreements || []).map((a) =>
            a.id === agreementId ? { ...a, ...updated } : a,
        );
        state.isEditing = false;
        syncEditStatesFromAgreements(aggreement.value.agreements);
    } catch (error) {
        console.error('Failed to save agreement edits:', error);
    } finally {
        state.isBusy = false;
    }
};


const aggreement = ref<AgreementSection | null>(null);
const sectionTitle = ref("");
const sectionDescription = ref("");
const fetchConsent = async() => {
    aggreement.value = await AgreementService.agreementSections.get(1);
    sectionTitle.value = aggreement.value.title;
    sectionDescription.value = aggreement.value.content;
    syncEditStatesFromAgreements(aggreement.value?.agreements);
}

watch(
    () => aggreement.value?.agreements,
    (agreements) => {
        syncEditStatesFromAgreements(agreements);
    },
);

watch(editMode, (enabled) => {
    if (!enabled) {
        syncEditStatesFromAgreements(aggreement.value?.agreements);
        agreementEditStates.value.forEach((s) => {
            s.isEditing = false;
            s.isBusy = false;
        });
    }
});

const createTitle = ref('');
const createDescription = ref('');
const createConsent = async () => {
    if (!aggreement.value) return;

    try {
        const payload: Omit<Agreement, 'id' | 'created_at'> = {
            title: createTitle.value,
            description: createDescription.value,
            agreement_section: aggreement.value.id,
        };

        const createdAgreement = await AgreementService.agreements.create(payload);
        aggreement.value.agreements = [...(aggreement.value.agreements || []), createdAgreement];
        syncEditStatesFromAgreements(aggreement.value.agreements);

        createTitle.value = '';
        createDescription.value = '';
    } catch (error) {
        console.error('Failed to create agreement:', error);
    }
}

const deleteAgreement = async (agreementId: number) => {
    if (!aggreement.value) return;

    try {
        await AgreementService.agreements.remove(agreementId);
        aggreement.value.agreements = (aggreement.value.agreements || []).filter((a) => a.id !== agreementId);
        syncEditStatesFromAgreements(aggreement.value.agreements);
    } catch (error) {
        console.error('Failed to delete agreement:', error);
    }
}

// AgreementSection

const isEditingAgreementSection = ref(false);
const toggleEditingAgreementSection = () => {
    isEditingAgreementSection.value = !isEditingAgreementSection.value;
};

const saveAgreementSectionEdits = async () => {
    if (!aggreement.value) return;
    try {
        const updated = await AgreementService.agreementSections.update(aggreement.value.id, {
            type: aggreement.value.type,
            title: sectionTitle.value,
            content: sectionDescription.value,
        });
        aggreement.value.title = updated.title;
        aggreement.value.content = updated.content;
        toggleEditingAgreementSection();
    } catch (error) {
        console.error('Failed to save agreement section edits:', error);
    }
};

onMounted(async() => {
    fetchConsent();
});
</script>

<template>

    <Dialog :show-for-user="true">
        <DialogTrigger>
            <Button variant="link"> Read Terms & Condition</Button>
        </DialogTrigger>
        <DialogContent class="max-h-[80vh] overflow-y-auto scroll-hidden" >
            <DialogHeader>
                <div  :class="editMode ? 'outline-2 outline-offset-2 outline-dashed p-3 relative rounded-xl' : ''">

                    <template v-if="!isEditingAgreementSection">
                        <div class="flex gap-3">
                            <Button
                                    v-if="editMode"
                                   type="button"
                                   variant="ghost"
                                   size="icon"
                                   @click="toggleEditingAgreementSection"
                               >
                               
                                <Wrench class="h-4 w-4" />
                           </Button>
                            <div>
                                <DialogTitle>{{ aggreement?.title }}</DialogTitle>
                                <DialogDescription>
                                    {{ aggreement?.content }}
                                </DialogDescription>
                            </div>
                        </div>
                    </template>

                    <template v-else> 
                        <div class="w-full space-y-2">
                            <Label>Title:</Label>
                            <Input v-model="sectionTitle" />
                            <Label>Description:</Label>
                            <Textarea v-model="sectionDescription" />
                            <Button type="button" size="sm" class="mr-2" @click="saveAgreementSectionEdits">Save</Button>
                            <Button type="button" size="sm" variant="outline" @click="toggleEditingAgreementSection">Cancel</Button>
                        </div>  

                    </template>
                </div>

                <div class="space-y-4 my-6">
                    <Card class="bg-orange-500/10 border-orange-500/30 border-2 flex dark:bg-orange-500/10 dark:border-orange-500/30">
                        <CardContent class="text-slate-800 dark:text-gray-200 font-semibold text-sm flex gap-5">
                            <AlertTriangle class="h-9 w-9 text-orange-500 " />
                            <div>
                                <strong>Important Notice:</strong>
                                <div>
                                    By participating in this
                                    simulation, you
                                    acknowledge and consent to the following:
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div
                        class="rounded-lg p-6 space-y-4 border bg-white text-slate-900 border-slate-200 dark:bg-[#1a1d2e] dark:text-white dark:border-[#2a2d3e]">

                        <div
                            class="flex gap-3 rounded-lg"
                            :class="editMode ? 'outline-2 outline-offset-2 outline-dashed p-3 relative' : ''"
                            v-for="(value, index) in aggreement?.agreements" :key="value.id"
                        >
                            
                            <Button
                                v-if="editMode && !isEditingAgreement(value.id)"
                                type="button"
                                variant="ghost"
                                size="icon"
                                
                                @click="beginEditingAgreement(value.id)"
                            >
                                
                                <Wrench class="h-4 w-4" />
                            </Button>
                            <div
                                class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#3b4a8c] dark:bg-[#3b4a8c]">
                                <span class="text-white text-xs font-bold">{{index + 1}}</span>
                            </div>
                            <div class="w-full">
                                <template v-if="!isEditingAgreement(value.id)">
                                    <h4 class="font-semibold mb-1 text-slate-900 dark:text-white">{{ value.title }}</h4>
                                    <p class="text-sm text-slate-600 dark:text-gray-400">{{ value.description }}</p>
                                </template>

                                <template v-else>
                                    <div class="w-full space-y-2">
                                        <Label>Title:</Label>
                                        <Input v-model="getEditState(value.id).title" :disabled="getEditState(value.id).isBusy" />
                                        <Label>Description:</Label>
                                        <Textarea v-model="getEditState(value.id).description" :disabled="getEditState(value.id).isBusy" />
                                    </div>

                                    <div class="flex justify-between flex-row-reverse gap-2 mt-3">
                                        <!-- <Button type="button" size="sm" variant="destructive">Delete</Button> -->
                                        <DeleteAlert @delete="deleteAgreement(value.id)"/>
                                        <div>
                                            <Button type="button" size="sm" @click="saveAgreementEdits(value.id)" :disabled="getEditState(value.id).isBusy">Save</Button>
                                            <Button type="button" size="sm" variant="outline" @click="cancelEditingAgreement(value.id)" :disabled="getEditState(value.id).isBusy">Cancel</Button>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>

                       

                        <div v-show="editMode" class="flex gap-3 outline-2 outline-offset-2 outline-dashed p-3 flex-col">
                            
                            <div class="w-full space-y-2">
                                <Label>Title:</Label>
                                <Input v-model="createTitle" />
                                <Label>Description:</Label>
                                <Textarea v-model="createDescription" />
                            </div>

                            <div class="self-end">
                                <Button type="button" @click="createConsent"><Plus></Plus>Add</Button>
                            </div>
                        </div>

                    </div>

                </div>
            </DialogHeader>
            <DialogFooter>
                
                <Button @click="toggleEditMode" v-if="useAuthStore().User.is_admin"><Wrench></Wrench> Edit Mode</Button>
                <DialogClose as-child>
                    <Button variant="outline" >
                        Back
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>


<style scoped>
.scroll-hidden {
    -ms-overflow-style: none;
    /* Internet Explorer 10+ */
    scrollbar-width: none;
    /* Firefox, Safari 18.2+, Chromium 121+ */
}

.scroll-hidden::-webkit-scrollbar {
    display: none;
    /* Older Safari and Chromium */
}
</style>