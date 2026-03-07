const PROFILE_KEY = "arcana-profile-v1"

export async function loadProfile() {
  try {
    if (window.storage) {
      const record = await window.storage.get(PROFILE_KEY)
      if (record?.value) return JSON.parse(record.value)
    }

    const localValue = localStorage.getItem(PROFILE_KEY)
    return localValue ? JSON.parse(localValue) : {}
  } catch {
    return {}
  }
}

export async function saveProfile(profile) {
  try {
    const serialized = JSON.stringify(profile)

    if (window.storage) {
      await window.storage.set(PROFILE_KEY, serialized)
      return
    }

    localStorage.setItem(PROFILE_KEY, serialized)
  } catch {}
}
