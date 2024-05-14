json.extract! entry, :id, :organization_id, :creator_id, :entry_type, :created_at, :updated_at
json.date entry.date&.to_time
json.type entry.entry_type
json.entryType entry.entry_type
json.fileUrl entry.file_url
json.entry_id entry.id

# Note: standard_ordering pulls items from the database and erases unsaved data
#       so in order to persist changed data we need to pass the normal entry_items
@entry_items = entry.changed? ? entry.entry_items : entry.entry_items.standard_ordering

json.items do
  json.array! @entry_items, partial: "entries/entry_item", as: :entry_item
end

json.entryItems do
  json.array! @entry_items, partial: "entries/entry_item", as: :entry_item
end

json.persisted entry.persisted?
json.url (entry.id && entry_url(entry))

# Permissions
json.partial! "shared/permissions", item: entry

# Available Actions
json.partial! "shared/standard_approval_actions", item: entry
