import LoginForm from '../../components/Auth/LoginForm'
import logo from '../../assets/logo.png'
import '../../styles/login.css'

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-left">
        <LoginForm />
      </div>

      <div className="login-right">
        <img
          src={logo}
          alt="Paysera"
          className="paysera-logo"
        />
      </div>
    </div>
  )
}