import { Scene } from "./scene";
import * as API from "../../api";
import { SceneNames } from "./scene-utility";
import CWS, { FuncMessageHandler } from "../../api/ws-client";
import { SMConnectedToServer, WSServerMessageTypes } from "../../../common/api/ws-messages";
import { UILogin } from "../../rendering/ui/components/game/login";

export class SceneLogin extends Scene {

    private login: UILogin;

    private messageHandlers: FuncMessageHandler[] = [];

    constructor() {
        super(SceneNames.Menu);

        this.messageHandlers[WSServerMessageTypes.Connected] = this.connectedToServer.bind(this);

        this.login = new UILogin(this.requestLogin.bind(this));
    }

    private async requestLogin(event: Event) {
        event.preventDefault();
        
        const credentials = this.login.getCredentials();
        const response = await API.login(credentials.username, credentials.password);
        if (response) {
            API.setToken(response.token);
            CWS.connect(response.token);
        }
        else {
            this.login.focus();
        }
    }

    private connectedToServer(message: SMConnectedToServer) {
        CWS.setUserId(message.userId);
        this.gotoScene(SceneNames.Game);
    }

    hello() {
        CWS.setMessageHandler(this.messageHandlers);
        CWS.forceClose();
        this.ui.add(this.login);
    }

    goodbye() {
        this.ui.remove(this.login);
    }
}