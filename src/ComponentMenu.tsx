import { useMemo } from "react";
import { Accordion, Separator, Surface } from "@heroui/react";
import { ChevronDown } from "@gravity-ui/icons";
import COMPONENT_MENU_OPTIONS, {
  type ComponentMenuOption,
} from "./componentMenuOptions";

export default function ComponentMenu() {
  const groupedMenuOptions = useMemo(
    () => Map.groupBy(COMPONENT_MENU_OPTIONS, (option) => option.category),
    []
  );

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    option: ComponentMenuOption
  ) => {
    // Store the component data in the drag event
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        kind: option.kind,
        options: option.options,
      })
    );
    e.dataTransfer.effectAllowed = "copy";
    if (option.icon) {
      const img = new Image();
      img.src = option.icon;
      e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
    }
  };

  return (
    <aside className="w-xs border-r border-divider flex flex-col">
      <h1 className="p-4 text-sm font-bold uppercase tracking-wider">
        Components
      </h1>
      <Separator />
      <div className="grow overflow-y-auto">
        <Accordion allowsMultipleExpanded defaultExpandedKeys={["Gate"]}>
          {Array.from(groupedMenuOptions.entries(), ([key, value]) => (
            <Accordion.Item key={key}>
              <Accordion.Heading>
                <Accordion.Trigger>
                  {key}
                  <Accordion.Indicator>
                    <ChevronDown />
                  </Accordion.Indicator>
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body className="grid grid-cols-3 gap-2">
                  {value.map((option, key) => (
                    <Surface
                      key={key}
                      className="relative rounded-3xl  cursor-grab aspect-square  active:scale-90 transition group"
                      onDragStart={(e) => handleDragStart(e, option)}
                      draggable
                    >
                      <img
                        src={option.icon}
                        alt=""
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90 group-hover:blur-sm group-hover:opacity-50 transition"
                      />
                      <div className="w-full h-full flex items-center justify-center text-center font-semibold text-transparent group-hover:text-accent-foreground transition">
                        {option.name}
                      </div>
                    </Surface>
                  ))}
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </aside>
  );
}
