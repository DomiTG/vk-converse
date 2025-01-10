import IEditorComponent from "@/components/editor/classes/IEditorComponent";
import RootComponent from "@/components/editor/components/RootComponent";
import IEditorPage from "@/components/editor/interfaces/IEditorPage";
import IPage from "@/components/editor/interfaces/IPage";

export const loadTemplateJson = (page: IPage): IEditorPage | null => {
  console.log("loading up page", page.name);
  const newPage = {
    name: page.name,
    root_component: null,
  } as IEditorPage;
  if (
    !page.components ||
    !page.components.id ||
    page.components.id !== "root"
  ) {
    console.warn("Invalid root component", page.components?.id);
    return null;
  }
  const rootComp = new RootComponent();
  loadSubComponents(rootComp, rootComp, page.components.subComponents);
  newPage.root_component = rootComp;
  return newPage;
};

export const loadSubComponents = (
  root: RootComponent,
  parent: IEditorComponent,
  components: any[],
): void => {
  console.log(components);
  const subComponents = [] as IEditorComponent[];
  components.forEach((component: any) => {
    console.log("Loading up sub comp", component.id);
    const newComponent = root.getComponentById(component.id)?.clone();
    if (!newComponent) {
      console.warn("Component not found", component.id);
      return;
    }
    newComponent.setRootComponent(root);
    component.settings.forEach((setting: any) => {
      const { id, value } = setting;
      newComponent.updateSetting(id, value);
    });
    loadSubComponents(root, newComponent, component.subComponents);
    subComponents.push(newComponent);
  });
  parent.subComponents = subComponents;
};
