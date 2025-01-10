import React, { useState, useEffect } from "react";
import { CgLock } from "react-icons/cg";
import IEditorComponent from "../classes/IEditorComponent";
import RootComponent from "./RootComponent";

export default class CountdownComponent extends IEditorComponent {
  timerComponent: IEditorComponent | null = null;

  constructor() {
    super(
      "Countdown",
      "Nátlakový časovač, který zvyšuje konverzi, když se zobrazí na stránce.",
      "countdown",
      CgLock,
      [
        {
          id: "INITIAL_TIME",
          name: "Čas výprodeje",
          type: "NUMBER",
          value: 1000 * 60 * 60 * 24 * 3,
          visible: true,
        },
      ],
    );
  }

  render() {
    if (!this.timerComponent && this.subComponents.length === 0) {
      const rootComponent = this.rootComponent as RootComponent;
      if (!rootComponent) return <div>Root component not found</div>;
      const textComponent = rootComponent.getComponentById("text");
      if (!textComponent) return <div>Text component not found</div>;
      this.timerComponent = textComponent.clone();
      this.timerComponent.setRootComponent(rootComponent);
      this.timerComponent.getSetting("html_content")!.value =
        "Čas vyprší za: 72 : 00 : 00";
      this.addSubComponent(this.timerComponent);
    }
    if (this.subComponents.length > 0 && !this.timerComponent) {
      console.log("executng");
      const component = this.subComponents.find(
        (subComponent) => subComponent.id === "text",
      );
      console.log(component);
      if (component) {
        this.timerComponent = component;
      }
    }
    return this.timerComponent ? (
      <Countdown
        INITIAL_TIME={
          this.getSetting("INITIAL_TIME")
            ? (this.getSetting("INITIAL_TIME")?.value as number)
            : 1000 * 60 * 60 * 24 * 3
        }
        component={this}
        textComponent={this.timerComponent}
      />
    ) : (
      <></>
    );
  }

  productionRender(): JSX.Element {
    if (this.subComponents.length > 0 && !this.timerComponent) {
      const component = this.subComponents.find(
        (subComponent) => subComponent.id === "text",
      );
      if (component) {
        this.timerComponent = component;
      }
    }
    return this.timerComponent ? (
      <Countdown
        INITIAL_TIME={
          this.getSetting("INITIAL_TIME")
            ? (this.getSetting("INITIAL_TIME")?.value as number)
            : 1000 * 60 * 60 * 24 * 3
        }
        component={this}
        textComponent={this.timerComponent as IEditorComponent}
        production
      />
    ) : (
      <p className="text-red-500">Countdown component not found</p>
    );
  }

  clone() {
    return new CountdownComponent();
  }
}

const Countdown = ({
  INITIAL_TIME = 1000 * 60 * 60 * 24 * 3,
  component,
  textComponent,
  production,
}: {
  INITIAL_TIME: number;
  component: IEditorComponent;
  textComponent?: IEditorComponent;
  production?: boolean;
}) => {
  const STORAGE_KEY = "timer-started";

  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem(STORAGE_KEY);
    if (storedTime) {
      return parseInt(storedTime) - Date.now();
    }
    localStorage.setItem(STORAGE_KEY, (Date.now() + INITIAL_TIME).toString());
    return INITIAL_TIME;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("interval");
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1000;
        localStorage.setItem(STORAGE_KEY, (Date.now() + newTime).toString());
        if (textComponent) {
          textComponent.updateSetting("html_content", `${formatTime(newTime)}`);
          textComponent.rootComponent?.getUpdateMethod()(textComponent);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `<b>${hours.toString().padStart(2, "0")}</b> : <b>${minutes
      .toString()
      .padStart(2, "0")}</b> : <b>${seconds.toString().padStart(2, "0")}</b>`;
  };

  return (
    component.subComponents.length &&
    component.subComponents.map((subComponent) =>
      production ? subComponent.productionRender() : subComponent.render(),
    )
  );
};
