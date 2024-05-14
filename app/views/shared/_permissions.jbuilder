# Permissions for items with the standard approval path

json.permissions do
  json.index             policy(item).index?
  json.create            policy(item).create?
  json.edit              policy(item).edit?
  json.view              policy(item).view?
  json.show              policy(item).show?
  json.update            policy(item).update?
  json.delete            policy(item).delete?
  json.save_draft        policy(item).save_draft?
  json.reverse_approval  policy(item).reverse_approval?
  json.send_for_approval policy(item).send_for_approval?
  json.approve           policy(item).approve?
  json.deny              policy(item).deny?
end
