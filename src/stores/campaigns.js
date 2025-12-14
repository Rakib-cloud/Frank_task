import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { campaignService } from '@/services/campaignService'

export const useCampaignStore = defineStore('campaigns', () => {
  const campaigns = ref([])
  const loading = ref(false)
  const error = ref(null)
  const activeTab = ref('all')

  const filteredCampaigns = computed(() => {
    if (activeTab.value === 'all') {
      return campaigns.value
    }
    return campaigns.value.filter(c => c.status === activeTab.value)
  })

  const activeCampaigns = computed(() => 
    campaigns.value.filter(c => c.status === 'active')
  )

  const scheduledCampaigns = computed(() => 
    campaigns.value.filter(c => c.status === 'scheduled')
  )

  const completedCampaigns = computed(() => 
    campaigns.value.filter(c => c.status === 'completed')
  )

  async function fetchCampaigns() {
    loading.value = true
    error.value = null

    try {
      campaigns.value = await campaignService.getAll()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function createCampaign(campaign) {
    loading.value = true
    error.value = null

    try {
      const newCampaign = await campaignService.create(campaign)
      campaigns.value.push(newCampaign)
      return newCampaign
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCampaign(id, campaign) {
    loading.value = true
    error.value = null

    try {
      const updated = await campaignService.update(id, campaign)
      const index = campaigns.value.findIndex(c => c.id === id)
      if (index !== -1) {
        campaigns.value[index] = updated
      }
      return updated
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteCampaign(id) {
    loading.value = true
    error.value = null

    try {
      await campaignService.delete(id)
      campaigns.value = campaigns.value.filter(c => c.id !== id)
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  function setActiveTab(tab) {
    activeTab.value = tab
  }

  return {
    campaigns,
    loading,
    error,
    activeTab,
    filteredCampaigns,
    activeCampaigns,
    scheduledCampaigns,
    completedCampaigns,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    setActiveTab
  }
})

