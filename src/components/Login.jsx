import styles from "./Login.module.css";
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Login({setAuthenticated}) {
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate("/webpage");
    }
    const [usernameInputHasValue, setUsernameInputHasValue] = useState(false);
    const [passwordInputHasValue, setPasswordInputHasValue] = useState(false);
    const [password, setPassword] = useState("");
    const [showWrongPasswordText, setShowWrongPasswordText] = useState(false);

    const login_auth = async (x) => {
        x.preventDefault();
        const usernameValue = document.getElementById("username").value;
        const passwordValue = document.getElementById("password").value;
        try {
            console.log("0")
            const response = await fetch(`http://localhost:4000/getData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: usernameValue, password: passwordValue }),
                credentials: 'include'
            });
            console.log("1.2")
            const data = await response.json();
            console.log("1")
            if (!data.isAuthenticated) {
                console.log("2")
                setShowWrongPasswordText(true);
            } else {
                console.log("3")
                setShowWrongPasswordText(false);
                setAuthenticated(true); // Update authentication state
                navigateHome();
            }
        } catch (err) {
            console.error(err)
        }
    }

    function passwordStater(x) {
        setPasswordInputHasValue(x.target.value.trim().length > 0);
        setPassword(x.target.value);
        console.log(password);
    }

    return(
        <div className={styles.mainpage}> 
            <article className={styles.main}>
                <div className={styles.loginright}>
                        <div className={styles.loginui}>
                            <div className={styles.iglogo}>
                                <div className={styles.igbox} role="button">
                                    <div className={styles.ig}></div>
                                </div>
                            </div>
                            <div className={styles.logincontainer}>
                                <form className={styles.loginwithin}>
                                    <div className={styles.loginparts}>
                                        <div className={styles.loginboxes}>
                                            <div className={`${styles.a990128} ${usernameInputHasValue ? styles.inputfilled : ''}`}>
                                                <div className={styles.label}>
                                                    <span className={`${styles.placeholdertext} ${usernameInputHasValue ? styles.smalltext : ''}`}>
                                                        Username
                                                    </span>
                                                    <input 
                                                        autoCapitalize="off" 
                                                        autoCorrect="off" 
                                                        maxLength={75} 
                                                        className={styles.input}
                                                        id="username"
                                                        onChange={(e) => setUsernameInputHasValue(e.target.value.trim().length > 0)}
                                                        >
                                                    </input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.loginboxes}>
                                            <div className={`${styles.a990128} ${passwordInputHasValue ? styles.inputfilled : ''}`}>
                                                <div className={styles.label}>
                                                    <span className={`${styles.placeholdertext} ${passwordInputHasValue ? styles.smalltext : ''}`}>
                                                        Password
                                                    </span>
                                                    <input 
                                                        autoCapitalize="off" 
                                                        autoCorrect="off" 
                                                        maxLength={75} 
                                                        className={styles.input}
                                                        id="password"
                                                        onChange={(e) => 
                                                            passwordStater(e)
                                                        }
                                                        >
                                                    </input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.loggin}>
                                            <button className={styles.loginbutton} onClick={login_auth}>
                                                <div className={styles.buttontext}>
                                                    Log In
                                                </div>
                                            </button>
                                        </div>
                                        <span className={styles.wrongpasswordtext} style={{display: showWrongPasswordText ? 'block' : 'none'}}>
                                            <div className={styles.wrongpasswordinner}>
                                                Sorry, your password was incorrect. Please double-check your password.
                                            </div>
                                        </span>
                                        <div className={styles.forgotpassword}>
                                            <span className={styles.forgotpasswordtext}>
                                                If you forgot your password, contact IT for assistance
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div> 
                    </div>  
            </article>
        </div>
    )
}