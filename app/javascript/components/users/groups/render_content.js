// Note: not actually a componeent, but a render function from the parent
import GroupCard from "./group_card";

const RenderContent = (props, refetch = function () {}, organizationId=0) => {
  return <GroupCard {...props} refetch={refetch} organizationId={organizationId} />;
};

export default RenderContent;
