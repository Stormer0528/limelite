# Basic Permissions for items with the StandardPolicy

json.permissions do
  json.index policy(item).index?
  json.show policy(item).show?
  json.view policy(item).show?
  json.create policy(item).create?
  json.update policy(item).update?
  json.destroy policy(item).destroy?
  json.delete policy(item).destroy?
end
