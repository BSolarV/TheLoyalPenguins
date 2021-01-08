import { LitElement, html } from "lit-element";

import '@vaadin/vaadin-split-layout';
import '@vaadin/vaadin-time-picker';
import '@kor-ui/kor/components/app-bar'
import '@kor-ui/kor/components/icon'
import '@kor-ui/kor/components/avatar'

import './crono-element'
import './tareas-element'
import './notas-element'

class PomodoroElement extends LitElement {
    static get properties() {
        return {
            setting: { type: Boolean },
            active: { type: Boolean },
            currentJob: { type: Object },
            counters: { type: Object },
        };
    }

    constructor() {
        super();
        this.setting = false;

        this.active = false;

        this.currentJob = {
            name: "Activity 1",
            duration: 4,
        };
        this.times = {
            pomo: 1500,
            short: 300,
            long: 900,
        }
    }

    timerDone(e) {
        this.active = true;
    }

    toggleSettings(){
        this.setting = !this.setting;
    }
    settingsOff(){
        this.setting = false;
    }

    nameUpdated(e) {
        console.log(e.detail.newName);
        this.currentJob.name = e.detail.newName;
    }

    updateCurrentTask(detail) {
        this.currentJob = {
            name: detail.name,
            duration: detail.duration,
        }
        this.requestUpdate();
        this.active = false;
    }

    render() {
        return html`
        <div style="height: 100%">
        <kor-app-bar 
            slot="top"
            logo="./images/logo_loyal.png" 
            label="The Loyal Penguins" 
            >
            <kor-icon slot="functions" icon="settings" button @click="${this.toggleSettings}"></kor-icon>
        </kor-app-bar>
        <vaadin-split-layout style="height: 100%;">
            <div style="min-width: 10%; max-width: 25%; height: 100%; text-align: center;">
                <div>JOBS!</div>
                <tareas-element
                    .name="${this.currentJob.name}"
                    .done="${this.active}"
                    @update-current-time="${(e) => { this.currentJob.duration = e.detail.newTime; this.requestUpdate(); }}"  
                    @update-current-name="${(e) => { this.currentJob.name = e.detail.newName; this.requestUpdate(); }}"  
                    @update-current-task="${(e) => { this.updateCurrentTask(e.detail) } }"
                ></tareas-element>
            </div>
            <vaadin-split-layout>
                <div style="min-width: 50%; height: 100%; text-align: center; color:#FF5733;" >
                    <crono-element 
                        .name="${this.currentJob.name}"
                        .duration = "${this.currentJob.duration}"
                        .pomoTime="${this.times.pomo}" 
                        .shortTime="${this.times.short}" 
                        .longTime="${this.times.long}" 
                        .done="${this.active}" 
                        @timer-done="${(e) => { this.timerDone(e); this.requestUpdate(); } }"
                        @update-name="${(e) => { this.nameUpdated(e); this.requestUpdate(); } } "
                    ></crono-element>
                </div>
                <vaadin-split-layout orientation="vertical" style="height: 100%;">
                    <div style="height: ${ this.setting ? "40%" : "0%"}; transition: height 1s">
                        <kor-app-bar label="Settings"></kor-app-bar >
                        <vaadin-accordion>
                            <vaadin-accordion-panel>
                                <div slot="summary">Pomodoros</div>
                                <vaadin-vertical-layout>
                                <vaadin-text-field value = "Minutos">
                                    <div>
                                    <vaadin-number-field
                                    value="25" min="5" max="40" has-controls>
                                    </vaadin-number-field>
                                    </div>  
                                </vaadin-text-field>
                                </vaadin-vertical-layout>
                            </vaadin-accordion-panel>
                            <vaadin-accordion-panel>
                                <div slot="summary">Short Break</div>
                                <vaadin-vertical-layout>
                                <vaadin-number-field value="5" min="1" max="10" has-controls></vaadin-number-field>
                                </vaadin-vertical-layout>
                            </vaadin-accordion-panel>
                            <vaadin-accordion-panel >
                                <div slot="summary">Long Break</div>
                                <vaadin-number-field value="15" min="5" max="30" has-controls></vaadin-number-field>
                            </vaadin-accordion-panel>
                        </vaadin-accordion>
                    </div>
                    <div style="height: 100%">
                        <notas-element></notas-element>
                    </div>
                </vaadin-split-layout>
            </vaadin-split-layout>
        </vaadin-split-layout>
        <div>aaaaa</div>
        </div>
        `;
    }
}

customElements.define("pomodoro-element", PomodoroElement);
