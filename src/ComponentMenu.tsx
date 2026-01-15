import { useMemo } from "react";
import COMPONENT_MENU_OPTIONS from "./ComponentMenuOptions";
import type { ComponentMenuOption } from "./ComponentMenuOptions";
import { Accordion, Card, Separator } from "@heroui/react";
import { ChevronDown } from "@gravity-ui/icons";

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
                <Accordion.Body className="grid grid-cols-2 gap-2">
                  {value.map((option) => (
                    <Card
                      className="border-2 border-transparent hover:border-accent hover:bg-accent items-center active:scale-90 transition"
                      onDragStart={(e) => handleDragStart(e, option)}
                      draggable
                    >
                      {option.icon && (
                        <Card.Content>
                          <img
                            src={option.icon}
                            alt=""
                            className="w-12 h-12 object-contain pointer-events-none opacity-90"
                          />
                        </Card.Content>
                      )}
                      <Card.Footer className="text-center">
                        {option.name}
                      </Card.Footer>
                    </Card>
                    // <Card
                    //   className="flex flex-col items-center justify-center text-center border border-transparent hover:border-accent active:scale-90 transition"
                    //   onDragStart={(e) => handleDragStart(e, option)}
                    //   draggable
                    // >
                    //   {option.icon && (
                    //     <img
                    //       src={option.icon}
                    //       alt=""
                    //       className="w-12 h-12 object-contain pointer-events-none opacity-90"
                    //     />
                    //   )}
                    //   <span className="text-sm text-default-600">
                    //     {option.name}
                    //   </span>
                    // </Card>
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
