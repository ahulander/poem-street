import { UIElement } from "../../ui";

const styleForm = {
    "background-color": "hotpink",
    "padding": "1em",
    "color": "white",
    "margin": "1em"
}

const styleHeader = {
    "margin-top": "0"
}

export class UILogin extends UIElement {
    
    private username: string;
    private password: string;

    private inputPassword: HTMLInputElement;

    constructor(
        onSubmit: (event: Event) => void
    ) {
        super();

        this.onChange = this.onChange.bind(this);

        this.inputPassword = <input type="password" name="password" onChange={this.onChange}/>

        this.root = (
            <form style={styleForm} onSubmit={onSubmit}>
                <h1 style={styleHeader}>Poem Street</h1>
                <input type="text" name="username" onChange={this.onChange}/>
                { this.inputPassword }
                <button type="submit">Login</button>
            </form>
        )
    }

    getCredentials() {
        const result = {
            username: this.username,
            password: this.password
        };

        this.password = "";
        this.inputPassword.value = "";

        return result;
    }

    focus() {
        this.inputPassword.value = this.password;
        this.inputPassword.focus();
    }

    enabled() {
        this.inputPassword.value = "";
    }

    private onChange(event: Event) {
        const target: any = event.target;
        switch (target.name) {
            case "username":
                this.username = target.value;
                break;
            case "password":
                this.password = target.value;
                break;
            default:
                console.warn(`Unrecognized input name: "${target.name}"`);
                break;
        }
    }
}
