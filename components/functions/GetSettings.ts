import { ISettings } from "../interfaces";

const GetSettings = (): ISettings => {
    return JSON.parse(localStorage.getItem("settings") || "{}") as ISettings;
};