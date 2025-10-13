import { ref, inject } from 'vue'

export function useEditableText(
  initialText: any,
  emit: DefineEmits<{
    giveProps: (text: string) => void
    signalDelete: () => void
    moveOrder: (id: number, direction: 'up' | 'down') => void
  }>,
) {
  const editable = inject('editable', false) // Inject the editable state
  const my_text = ref(initialText) // Reactive text value

  const updateProps = ($event: any) => {
    my_text.value = $event // Merge the updated properties
    console.log('Updated text:', $event)
    emit('giveProps', $event) // Emit the updated text to the parent
  }

  const deleteComponent = () => {
    emit('signalDelete') // Emit the delete signal to the parent
  }

  const addComponent = (type: string) => {
    alert(type);
    emit('addComponent', type, null) // Emit the add component signal to the parent
  }

  const reorderComponent = (direction: 'up' | 'down') => {
    emit('moveOrder', direction) // Emit the reorder signal to the parent
  }

  return {
    editable,
    my_text,
    updateProps,
    deleteComponent,
    addComponent,
    reorderComponent,
  }
}
