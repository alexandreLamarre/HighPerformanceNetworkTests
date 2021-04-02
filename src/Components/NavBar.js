import {IonContent, IonItem} from "@ionic/react";

const NavBar = props => {

    return (
        <IonContent style = {{position:"absolute", top: "0", left: "0", height: "50px", width: "100%"}}>
            <IonItem > Tool </IonItem>
        </IonContent>
    )
}

export default NavBar;
