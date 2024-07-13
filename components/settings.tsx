import React, { useEffect, useState } from "react"
import { Card, CardBody, Switch, Input, Button } from "@nextui-org/react"

interface ISettings {
    isUpdatingPrices: boolean
    isNotifying: boolean
    updatePeriod: number
    minSpreadByNotify: number
}

export const SettingComponent: React.FC = () => {
    const loadInitialSettings = (): ISettings => {
        const savedSettings = localStorage.getItem("settings")
        if (savedSettings) return JSON.parse(savedSettings)
            
        return {
            isUpdatingPrices: true,
            isNotifying: false,
            updatePeriod: 5 * 1000,
            minSpreadByNotify: 7.5
        }
    }

    const [settings, setSettings] = useState<ISettings>(loadInitialSettings())
    const [isModified, setIsModified] = useState(false)

    useEffect(() => {
        const savedSettings = loadInitialSettings()
        setSettings(savedSettings)
        setIsModified(false)
    }, [])

    useEffect(() => {
        const initialSettings = loadInitialSettings()
        const hasChanged = JSON.stringify(settings) !== JSON.stringify(initialSettings)
        setIsModified(hasChanged)
    }, [settings])

    const handleSwitchChange = (field: keyof ISettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            [field]: e.target.checked,
        }))
    }

    const handleInputChange = (field: keyof ISettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = field === "updatePeriod" || field === "minSpreadByNotify" ? parseFloat(e.target.value) : e.target.value
        setSettings((prevSettings) => ({
            ...prevSettings,
            [field]: value,
        }))
    }

    const handleSave = () => {
        localStorage.setItem('settings', JSON.stringify(settings))
        setIsModified(false)
    }

    return <Card>
        <CardBody>
            <section className="space-y-2 mx-auto">
                <section className="flex items-center space-x-2 w-fit">
                    <h1>{"Обновлять цены: "}</h1>
                    <Switch
                        defaultSelected={settings.isUpdatingPrices}
                        onChange={handleSwitchChange("isUpdatingPrices")}
                    />
                </section>

                <section className="flex items-center space-x-2 w-fit">
                    <h1>{"Уведомления: "}</h1>
                    <Switch
                        defaultSelected={settings.isNotifying}
                        onChange={handleSwitchChange("isNotifying")}
                    />
                </section>

                <section className="flex items-center space-x-2 w-fit">
                    <h1>{"Обновление: "}</h1>
                    <Input
                        type="number"
                        placeholder="5 (сек)"
                        size="sm"
                        value={String(settings.updatePeriod)}
                        onChange={handleInputChange("updatePeriod")}
                    />
                </section>

                <section className="flex items-center space-x-2 w-fit">
                    <h1>{"Спред: "}</h1>
                    <Input
                        type="number"
                        placeholder="1,25 (%)"
                        size="sm"
                        value={String(settings.minSpreadByNotify)}
                        onChange={handleInputChange("minSpreadByNotify")}
                    />
                </section>

                <Button color={isModified ? "primary" : "default"} disabled={!isModified} onClick={handleSave}>
                    <h1 className="font-bold">Сохранить</h1>
                </Button>
            </section>
        </CardBody>
    </Card>
}