import { Navigate, useParams } from "react-router-dom";

const ReferralsLegacyDetailIdRoute = () => {
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/navigator/referrals" replace />;
  }

  return <Navigate to={`/navigator/referrals/detail?id=${encodeURIComponent(id)}`} replace />;
};

export default ReferralsLegacyDetailIdRoute;
