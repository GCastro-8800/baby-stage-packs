import { useParams, Navigate } from "react-router-dom";

const PackStageRedirect = () => {
  const { packId } = useParams<{ packId: string }>();
  return <Navigate to={`/packs/${packId}`} replace />;
};

export default PackStageRedirect;
