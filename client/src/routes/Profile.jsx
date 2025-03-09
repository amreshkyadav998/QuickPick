import MyAccount from "../components/Account/MyAccount/MyAccount";
import ManageAccount from "../components/Account/ManageAccount/ManageAccount";
// import General from "../utils/General";

const TabTitle = (title) => {
    document.title = title;
};

export const Profile = () => {
    TabTitle("My Account - Shema");

    return <MyAccount />;
};

export const AccountManager = () => {
    TabTitle("My Account - Shema");

    return <ManageAccount />;
};
