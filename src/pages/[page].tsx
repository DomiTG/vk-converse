import PageHandler from "@/components/PageHandler";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathName = usePathname().split("/");
  console.log(pathName[1]);
  return pathName.length > 1 ? <PageHandler route={pathName[1]} /> : "400444";
}
