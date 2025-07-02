import { usePaellaTranslate } from "../plugins/PreactButtonPlugin/PreactButtonPlugin";
import "./AIToolAlert.css";

export default function AIToolAlert() {
    const t = usePaellaTranslate();
    
    return (
        <div className="aitool-alert">
            <p> <strong>{t("Warning!")}</strong> {t("This content has been created by an artificial intelligence tool.")}</p>
            <p>{t("While it may be useful as a starting point, it is essential that you check it against other reliable sources.")}</p>
            <p>{t("The information provided here should be verified with additional sources before making any important decisions.")}</p>
        </div>
    )
}