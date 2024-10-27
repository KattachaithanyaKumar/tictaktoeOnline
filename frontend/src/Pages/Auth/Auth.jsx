import "./style.css"


const Auth = () => {
  return (
    <div className="auth-page">
        <div className="auth-box">
            <h1>Tic Tac Toe Online</h1>
            <p><i>Challenge Your Friend to a Quick Duel</i></p>

            <form>
                <div>
                    <input type="text" placeholder="Enter username" />
                    <button>Play</button>   
                </div>

                <div>
                    <input type="text" placeholder="Enter room ID" />
                    <button>Join Room</button>
                </div>
                
            </form>
        </div>
    </div>
  )
}

export default Auth