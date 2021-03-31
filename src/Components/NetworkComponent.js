import React from "react";
import {createNetworkSystem} from "../Graphics/NetworkSystem";
import TimedChunk from "../Datatypes/TimedChunk";
import {updatePositionsFromScalar} from "../Graphics/Updates";

/**
 * Network component that handles the network canvas
 */
export default class NetworkComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            prevHeight: 1,
            prevWidth: 1,
        };
        this.canvas = React.createRef();
        this.resize = this.resize.bind(this);
        this.pointerMove = this.onPointerMove.bind(this);
        this.graphics = null;
    }

    componentDidMount(){
        const w = this.width(); const h = this.height();
        this.setState({prevHeight: h, prevWidth: w});
        this.graphics = createNetworkSystem(this.canvas.current, w, h, 55000, 55000);
        this.graphics.renderer.render(this.graphics.scene, this.graphics.camera);
        document.addEventListener("pointermove", this.pointerMove)
        window.addEventListener("resize", this.resize);
        window.requestAnimationFrame(() => this.animate());
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    animate(){
        this.graphics.renderer.render(this.graphics.scene, this.graphics.camera);

        //update intersection
        this.graphics.raycaster.setFromCamera(this.graphics.pointer, this.graphics.camera);
        const intersects = this.graphics.raycaster.intersectObject(this.graphics.nodes);
        if(intersects.length > 0){
            console.log("intersects", intersects[0].point);
            this.graphics.cursor.position.set(intersects[0].point);
            this.graphics.cursor.visible = true;

        } else{
            this.graphics.cursor.visible = false;
        }

        window.requestAnimationFrame(() => this.animate());
    }




    /**
     * Adjusts the canvas and renderer size when the window resize listener i
     * is called
     */
    resize(){
        if(this.canvas.current !== null){
            const w = this.width(); const h = this.height();
            this.setCanvas(w,h);
            this.graphics.camera.aspect = w/h;
            this.graphics.renderer.setSize(w,h);

        }
    }

    onPointerMove(e){
        this.graphics.pointer.set( (e.clientX/ this.width())* 2 -1, (e.clientY/ this.height()) * 2 + 1);
    }

    width(){
        return window.innerWidth * 0.95;
    }

    height(){
        return window.innerHeight * 0.95;
    }

    setCanvas(width, height){
        this.canvas.current.width = width;
        this.canvas.current.height = height;
    }


    render(){
        return(<div>
            <canvas ref = {this.canvas} style = {{backgroundColor: "rgb(108,108,108)"}}/>
        </div>);
    }
}

