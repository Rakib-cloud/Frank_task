import { computed, onMounted } from 'vue'
import { useCampaignStore } from '@/stores/campaigns'
import { useUIStore } from '@/stores/ui'

export function useCampaigns() {
  const campaignStore = useCampaignStore()
  const uiStore = useUIStore()

  const campaigns = computed(() => campaignStore.filteredCampaigns)
  const allCampaigns = computed(() => campaignStore.campaigns)
  const activeCampaigns = computed(() => campaignStore.activeCampaigns)
  const scheduledCampaigns = computed(() => campaignStore.scheduledCampaigns)
  const completedCampaigns = computed(() => campaignStore.completedCampaigns)
  const activeTab = computed(() => campaignStore.activeTab)
  const loading = computed(() => campaignStore.loading)
  const error = computed(() => campaignStore.error)

  function fetchCampaigns() {
    return campaignStore.fetchCampaigns()
  }

  function setActiveTab(tab) {
    campaignStore.setActiveTab(tab)
  }

  async function createCampaign(campaign) {
    const result = await campaignStore.createCampaign(campaign)
    uiStore.closeModal()
    return result
  }

  async function updateCampaign(id, campaign) {
    const result = await campaignStore.updateCampaign(id, campaign)
    uiStore.closeModal()
    return result
  }

  async function deleteCampaign(id) {
    await campaignStore.deleteCampaign(id)
  }

  function openCreateModal() {
    uiStore.openModal('campaign-form', null)
  }

  function openEditModal(campaign) {
    uiStore.openModal('campaign-form', campaign)
  }

  onMounted(() => {
    if (campaignStore.campaigns.length === 0) {
      fetchCampaigns()
    }
  })

  return {
    campaigns,
    allCampaigns,
    activeCampaigns,
    scheduledCampaigns,
    completedCampaigns,
    activeTab,
    loading,
    error,
    fetchCampaigns,
    setActiveTab,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    openCreateModal,
    openEditModal
  }
}

