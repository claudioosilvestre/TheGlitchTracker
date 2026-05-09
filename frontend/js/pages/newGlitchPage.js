import {
    bindNewGlitchForm,
    buildUserOptions
} from '../actions/glitchActions.js';


// NEW GLITCH FORM
// Renders the form to create a new glitch.
// Loads users and allows assigning a glitch to an operative.
export async function renderNewGlitch() {
    const app = document.getElementById('app');

    const userOptions =
        await buildUserOptions();

    app.innerHTML = `
        <div class="page-title">
            > REPORT_NEW_GLITCH //
            <span>OPERATIVE INPUT</span>
        </div>

        <div class="glitch-card form-card">

            <div class="form-group">
                <label class="form-label">
                    Glitch Title *
                </label>

                <input
                    class="form-input"
                    id="f-title"
                    type="text"
                    placeholder="Describe the anomaly..."
                />
            </div>

            <div class="form-group">
                <label class="form-label">
                    Description
                </label>

                <textarea
                    class="form-textarea"
                    id="f-desc"
                    placeholder="Additional intel..."
                ></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Threat Level (Priority) *
                </label>

                <select class="form-select" id="f-priority">
                    <option value="" disabled selected>
                        -- Select Threat Level --
                    </option>

                    <option value="AGENT_SMITH">
                        Agent Smith — CRITICAL
                    </option>

                    <option value="HIGH_ALERT">
                        High Alert — HIGH
                    </option>

                    <option value="GLITCH">
                        Glitch — MEDIUM
                    </option>

                    <option value="DEJA_VU">
                        Déjà Vu — LOW
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Assign to Operative
                </label>

                <select class="form-select" id="f-assign">
                    <option value="">
                        -- Unassigned --
                    </option>

                    ${userOptions}
                </select>
            </div>

            <button class="btn-submit" id="btn-submit">
                > INJECT INTO SYSTEM
            </button>

            <div class="msg success" id="msg-ok">
                > GLITCH LOGGED.
                THE ORACLE HAS BEEN NOTIFIED.
            </div>

            <div class="msg error" id="msg-err">
                > TRANSMISSION FAILED.
                TRY AGAIN.
            </div>
        </div>
    `;

    bindNewGlitchForm();
}
