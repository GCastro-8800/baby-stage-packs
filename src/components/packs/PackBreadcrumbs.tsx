import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PackBreadcrumbsProps {
  packName?: string;
  packId?: string;
  stageName?: string;
}

const PackBreadcrumbs = ({ packName, packId, stageName }: PackBreadcrumbsProps) => (
  <Breadcrumb className="mb-6">
    <BreadcrumbList>
      <BreadcrumbItem>
        {packName ? (
          <BreadcrumbLink asChild>
            <Link to="/packs">Packs</Link>
          </BreadcrumbLink>
        ) : (
          <BreadcrumbPage>Packs</BreadcrumbPage>
        )}
      </BreadcrumbItem>

      {packName && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {stageName ? (
              <BreadcrumbLink asChild>
                <Link to={`/packs/${packId}`}>{packName}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{packName}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </>
      )}

      {stageName && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{stageName}</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </BreadcrumbList>
  </Breadcrumb>
);

export default PackBreadcrumbs;
