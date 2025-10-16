import { useState } from 'react';

function Login({ onclose, setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(async response => {
            if (response.ok) {
                const data = await response.json();
                setUser(data.nickname, data.isDoctor);
                onclose();
            } else {
                const text = await response.text();
                setError(text || 'Login failed.');
            }
        })
        .catch(() => {
            setError('Network error. Please try again.');
        });
    };

    return (
        <div className="Box login">
            <h4>Login</h4>
            <form onSubmit={handleSubmit}>
                <div className="text_area">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="text_input"
                        placeholder="Enter Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="text_area">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="text_input"
                        placeholder="Enter Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                <input
                    type="submit"
                    value="LOGIN"
                    className="btn"
                />
            </form>
            <button onClick={onclose}>close</button>
        </div>
    );
}

export default Login;