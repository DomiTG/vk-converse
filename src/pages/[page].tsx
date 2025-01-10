import PageHandler from "@/components/PageHandler";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathName = usePathname();
  return <PageHandler route={pathName} />;
}
