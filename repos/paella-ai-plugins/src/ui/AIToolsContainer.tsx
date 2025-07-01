import { createContext, useContext } from "react";
import type AIContentPlugin from "../plugins/es.upv.paella.ai.content.jsx";
import TabContainer, { TabItem } from "./TabContainer";
import AIToolView from "./AIToolView";
import AIToolPodcast from "./AIToolPodcast.js"; 
// import Chat from "./Chat.js";

const PaellaPluginContext = createContext<AIContentPlugin | null>(null);

export const usePaellaPlugin = () => {
  const context = useContext(PaellaPluginContext);
  if (!context) {
    throw new Error("usePaellaPlugin must be used inside AIToolsContainer");
  }
  return context;
};

export const usePaellaTranslate = () => {
  const plugin = usePaellaPlugin();
  return plugin.player.translate;
};


export const AIToolsContainer = ({paellaPlugin}: {paellaPlugin: AIContentPlugin}) => {
    const t = paellaPlugin.player.translate;
    return (     
        <PaellaPluginContext.Provider value={paellaPlugin}>
            <TabContainer>
                
                { paellaPlugin.summary?.content && <TabItem label={t('Summary')}>
                    <AIToolView
                        data={paellaPlugin.summary}
                    />
                </TabItem>
                }
                { paellaPlugin.faq?.content && <TabItem label={t("FAQ")}>
                    <AIToolView
                        data={paellaPlugin.faq}
                    />
                </TabItem>
                }
                { paellaPlugin.study_plan?.content && <TabItem label={t("Study plan")}>
                    <AIToolView
                        data={paellaPlugin.study_plan}                    
                    />
                </TabItem>
                }
                { paellaPlugin.timeline?.content && <TabItem label={t("Timeline")}>
                    <AIToolView
                        data={paellaPlugin.timeline}
                    />
                </TabItem>
                }
                { paellaPlugin.podcast?.content && <TabItem label={t("Podcast")}>
                    <AIToolPodcast data={paellaPlugin.podcast} />
                </TabItem>
                }                
            </TabContainer>
        </PaellaPluginContext.Provider>   
    );
};


