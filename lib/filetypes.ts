import { DataRecord } from '@integration-app/sdk'

export function getFileType(file: DataRecord) {
  if (file.fields?.itemType == 'folder') return 'folder'
  if (file.fields?.mimeType) {
    const type = file?.fields?.mimeType.split('/')[0]
    if (['image', 'audio', 'video'].includes(type)) return type
  }
  const extension =
    file.fields?.name?.split('.')?.pop()?.toLowerCase() ?? 'bin'
  switch (extension) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return 'image'
    case 'mp3':
    case 'wav':
    case 'aac':
    case 'flac':
      return 'audio'
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'mkv':
      return 'video'
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'odt':
    case 'rtf':
    case 'txt':
    case 'md':
    case 'pages':
      return 'document'
    case 'xls':
    case 'xlsx':
    case 'ods':
    case 'numbers':
      return 'spreadsheet'
    default:
      return 'unknown'
  }
}
