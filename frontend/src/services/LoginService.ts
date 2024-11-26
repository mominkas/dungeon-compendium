class LoginService {
    private static instance: LoginService;
    private participantId: number | null = null;

    private constructor() {
        const storedParticipantId = localStorage.getItem('participantId');
        if (storedParticipantId) {
            this.participantId = parseInt(storedParticipantId);
        }
    }

    static getInstance(): LoginService {
        if (!this.instance) {
            this.instance = new LoginService();
            return this.instance;
        }
        else {
            return this.instance;
        }
    }

    public async login(name: string, password: string): Promise<boolean> {
        if (!name || !password) {
            throw new Error("Both name and password are required")
        }
        try {
            const response = await fetch(`http://localhost:5001/users/login`, {
            method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({name, password})
            });

            if (!response.ok) {
                const errorMsg = await response.json();
                throw new Error(errorMsg.error)
            }

            const successfulLogin = await response.json();
            this.participantId = successfulLogin.user.id;
            console.log()
            localStorage.setItem('participantId', this.participantId!.toString());
            localStorage.setItem('isLoggedIn', 'true');


            return true

        } catch (error) {
            throw new Error("Failed to login: " + error)            
        }
    }

    public logout(): void {
        this.participantId = null;
        localStorage.removeItem('participantId');
        localStorage.removeItem('isLoggedIn');
    }

    public isLoggedIn(): boolean {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    public getParticipantId(): number | null {
        if (!this.participantId) {
            throw new Error("Participant Id is null. Ensure that the user is logged in")
        }
        return this.participantId;
    }
}

export default LoginService;