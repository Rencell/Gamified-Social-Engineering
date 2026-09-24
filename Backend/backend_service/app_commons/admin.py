from django.contrib import admin
from .models import AgreementSection, Agreement, simulationGuide


# Register your models here.
@admin.register(AgreementSection)
class AgreementSectionAdmin(admin.ModelAdmin):
	list_display = ("title", "type", "created_at")
	search_fields = ("title", "type")


@admin.register(Agreement)
class AgreementAdmin(admin.ModelAdmin):
	list_display = ("title", "agreement_section", "created_at")
	search_fields = ("title", "description")
	list_filter = ("agreement_section",)


@admin.register(simulationGuide)
class SimulationGuideAdmin(admin.ModelAdmin):
	list_display = ("title", "type", "ordering", "created_at")
	list_filter = ("type",)
	search_fields = ("title", "description")

