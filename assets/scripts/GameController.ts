import { _decorator, Camera, Component, director, EventTouch, find, Layers, Node, tween, UITransform, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    static instance: GameController = null;


    private isDragging: boolean = false;

    @property(Node) StageChain1: Node = null;
    @property(Node) StageChain2: Node = null;
    @property(Node) StageChain3: Node = null;
    @property(Node) Tus: Node = null;

    @property public numberlv : number = 0  ;
    @property public lv :number = 1;

    private selectedNode: Node | null = null;
    @property(Camera)
    public camera: Camera | null = null; // Gán camera từ Editor

   // @property([Node])   // Sử dụng decorator để khai báo thuộc tính là một danh sách Node
   // public StageLevel: Node[] = [];

    //stageNumber: number = 1;

    @property(Node) Room1: Node = null;
    @property(Node) public Position: Node[] = [];

   // @property([Node]) public Stage1: Node[][] = [];

    protected onLoad(): void {
        GameController.instance = this;
    }

    protected start(): void {
        //this.addInputEvent();
        this.Room1.children.forEach(child => {
            //console.log(child.name);
            this.Position.push(child);
        });
    }
    scaleObject(targetNode: Node) {
        // Bắt đầu scale từ 0
        targetNode.setScale(0, 0, 0);

        // Sử dụng Tween để scale từ 0 đến 1 trong 1 giây
        tween(targetNode)
            .to(1, { scale: v3(1, 1, 1) })
            .start();

    }

    addScore(){
        this.numberlv ++;
        if (this.lv == 1  && this.numberlv == 3) {
            this.nextLevel();
        }
    }

    minusScore(){

    }

    nextLevel(){

    }

    // addInputEvent() {
    //     console.log("addEvent");
    //     const canvas = find('Canvas');
    //     canvas.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    //     canvas.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    //     canvas.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    //     // canvas.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    // }

    // removeInputEvent() {
    //     const canvas = find('Canvas');
    //     canvas.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    //     canvas.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    //     canvas.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    // }

    // onTouchStart(event: EventTouch) {
    //     if (this.Tus.active) {
    //         this.Tus.active = false;
    //         this.removeInputEvent();
    //     }
    //     //console.log('onTouchStart ')
    //     // if (this.camera) {
    //     //     const touchPos = event.getLocation();
    //     //     const worldTouchPos = this.camera.screenToWorld(new Vec3(touchPos.x, touchPos.y, 0));

    //     //     const children = this.StageLevel[this.stageNumber - 1].children;
    //     //     //console.log('children: ' + children.length);
    //     //     for (let i = 0; i < children.length; i++) {
    //     //         //console.log('children: ' + children[i].layer);
    //     //         const child = children[i];
    //     //         const uiTransform = child.getComponent(UITransform);
    //     //         if (uiTransform && uiTransform.getBoundingBoxToWorld().contains(new Vec2(worldTouchPos.x, worldTouchPos.y))) {
    //     //             //console.log(child.layer);
    //     //             if (child.layer == 1) {
    //     //                 //console.log('Sprite with layer "target" is clicked!');
    //     //                 this.selectedNode = child;
    //     //                 this.selectedNode.scale = new Vec3(1, 1, 1);
    //     //             }
    //     //         }
    //     //     }
    //     // }
    // }




    // onTouchMove(event: EventTouch) {
    //     // if (this.selectedNode) {

    //     //     const delta = event.getDelta();
    //     //     const newPos = this.selectedNode.position.clone();
    //     //     newPos.x += delta.x;
    //     //     newPos.y += delta.y;
    //     //     this.selectedNode.setPosition(newPos);
    //     // }
    // }

    // onTouchEnd(event: EventTouch) {
    //     // if (this.selectedNode) {
    //     //     //console.log('Released sprite');
    //     //     this.selectedNode.scale = new Vec3(0.9, 0.9, 0.9);
    //     //     this.selectedNode = null;
    //     // }
    // }



}


