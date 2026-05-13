export interface ParsedRow {
  [key: string]: string
}

export interface ParseResult {
  headers: string[]
  rows: ParsedRow[]
  errors: string[]
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ""
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 2
        continue
      }
      inQuotes = !inQuotes
    } else if (ch === "," && !inQuotes) {
      fields.push(current)
      current = ""
    } else {
      current += ch
    }
    i++
  }
  fields.push(current)
  return fields
}

export function parseCSV(text: string): ParseResult {
  const errors: string[] = []
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")

  const nonEmptyLines = lines.filter((l) => l.trim().length > 0)
  if (nonEmptyLines.length === 0) {
    return { headers: [], rows: [], errors: ["CSV file is empty"] }
  }

  const headers = parseCSVLine(nonEmptyLines[0]).map((h) => h.trim())
  const rows: ParsedRow[] = []

  for (let i = 1; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i]
    if (!line.trim()) continue

    const values = parseCSVLine(line)
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: expected ${headers.length} columns, got ${values.length}`)
      continue
    }

    const row: ParsedRow = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx]?.trim() ?? ""
    })
    rows.push(row)
  }

  return { headers, rows, errors }
}

export const CSV_TEMPLATE_HEADERS = [
  "title",
  "description",
  "long_description",
  "event_date",
  "end_date",
  "location",
  "address",
  "image_url",
  "registration_url",
  "registration_label",
  "price",
  "capacity",
  "tags",
  "is_featured",
]

export function generateCSVTemplate(): string {
  const header = CSV_TEMPLATE_HEADERS.join(",")
  const example = [
    '"ASSOC Networking Night 2025"',
    '"Connect with actuarial professionals"',
    '"Full description here..."',
    '"2025-09-27T19:00:00"',
    '"2025-09-27T21:00:00"',
    '"Macquarie University"',
    '"Balaclava Road, Macquarie Park NSW 2109"',
    '""',
    '"https://humanitix.com/..."',
    '"Register Now"',
    '"Free"',
    '"100"',
    '"Networking|Professional"',
    '"false"',
  ].join(",")
  return `${header}\n${example}\n`
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
