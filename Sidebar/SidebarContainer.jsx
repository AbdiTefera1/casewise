import { FaBoxes, FaUserCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { SidebarItem } from "./Sidebar";
import { MdBattery3Bar, MdDashboard, MdSettings } from "react-icons/md";
import { BiHelpCircle, BiPackage, BiReceipt } from "react-icons/bi";

function SidebarContainer() {
  return (
    <div className="flex justify-start items-center">
      {/* <Sidebar/> */}
      <Sidebar>
        <SidebarItem icon={<MdDashboard size={20} />} text="Dashboard" alert />
        <SidebarItem
          icon={<MdBattery3Bar size={20} />}
          text="Statistics"
          active
        />
        <SidebarItem icon={<FaUserCircle size={20} />} text="Users" />
        <SidebarItem icon={<FaBoxes size={20} />} text="Inventory" />
        <SidebarItem icon={<BiPackage size={20} />} text="Orders" alert />
        <SidebarItem icon={<BiReceipt size={20} />} text="Billings" />
        <hr className="my-3" />
        <SidebarItem icon={<MdSettings size={20} />} text="Settings" />
        <SidebarItem icon={<BiHelpCircle size={20} />} text="Help" />
      </Sidebar>
    </div>
  );
}

export default SidebarContainer;
