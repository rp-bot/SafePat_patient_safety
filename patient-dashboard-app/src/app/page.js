import { currentUser } from '@clerk/nextjs'
import { supabase } from '@/utils/supabase/supabaseClient'
import UserProfileFormWrapper from './components/UserProfileFormWrapper'

async function getPatientData() {
  const user = await currentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('Patient')
    .select('dob')
    .eq('clerk_username', user.username)
    .single()

  if (error) {
    console.error('Error fetching patient data:', error)
    return null
  }

  return data
}

export default async function Page() {
  const patientData = await getPatientData()

  const showForm = !patientData || !patientData.dob

  return (
    <>
      {showForm && <UserProfileFormWrapper />}
      {!showForm && <p>Your profile is complete.</p>}
    </>
  )
}