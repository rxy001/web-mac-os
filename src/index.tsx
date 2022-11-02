import ReactDOM from "react-dom/client"
import { Provider as ReactRedux } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { Provider as EventEmitter, createEventEmitter } from "@eventEmitter"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import store from "./redux"
import "./less/index.less"
import darkMode from "./darkMode"

if (darkMode.isDarkMode()) {
  darkMode.addDarkClassName()
}

const eventEmitter = createEventEmitter()

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <BrowserRouter>
    <ReactRedux store={store}>
      <EventEmitter eventEmitter={eventEmitter}>
        <App />
      </EventEmitter>
    </ReactRedux>
  </BrowserRouter>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
