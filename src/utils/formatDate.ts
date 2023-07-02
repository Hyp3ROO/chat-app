import { formatRelative } from 'date-fns'

export const formatDate = (date: Date) => {
  let formattedDate
  if (date) {
    const dateInMiliseconds = date.getTime()
    formattedDate = formatRelative(dateInMiliseconds, new Date())
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
  }
  return formattedDate
}
