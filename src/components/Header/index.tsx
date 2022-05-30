import { Logout, Menu, Minus } from "../icons";
import { useAppDispatch } from "../../redux/hooks";
import { setAuthFlag, setOnlineUserList, setProfile, togglePanel } from "../../redux/slices/chatSlice";

const Header = ({ flag, setPanelState }: { flag: Boolean, setPanelState: Function }) => {
  const dispatch = useAppDispatch();

  const toggleLeftPanel = () => {
    dispatch(togglePanel(true));
  }

  const logout = () => {
    dispatch(setProfile({}));
    dispatch(setAuthFlag(false));
    dispatch(setOnlineUserList([]));
    localStorage.removeItem("name");
    localStorage.removeItem("authFlag");
    (window as any).socket.disconnect();
    (window as any).socket = undefined;
    (window as any).authFlag = false;
    (window as any).initFlag = false;

  }

  const toggleEntirePanel = () => {
    setPanelState(true);
    localStorage.setItem('toggle-sharity-panel', "true");
  }

  return (
    <header
      className="!flex !items-center !justify-between !px-5 !py-3 !border-b"
    >
      <div className="!text-gray-300 !cursor-pointer hover:!text-secondary" onClick={toggleLeftPanel}>
        <Menu />
      </div>
      <div className="text-gray-300 !text-2xl">
        Solarity chat
      </div>
        <div className="flex gap-2">
          {flag ? (
            <div className="!text-gray-300 !cursor-pointer hover:!text-secondary" onClick={logout}>
              <Logout />
            </div>
          ): (<div></div>)}
          <div className="!text-gray-300 !cursor-pointer hover:!text-secondary" onClick={toggleEntirePanel}>
            <Minus />
          </div>
        </div>
    </header>
  );
}

export default Header;