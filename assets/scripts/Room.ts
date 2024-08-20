import { _decorator, Camera, Component, EventTouch, find, Input, Layers, Node, Rect, UITransform, Vec3 } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

@ccclass('Room')
export class Room extends Component {
    @property(Camera) public camera: Camera | null = null; // Gán camera từ Editor
    @property(Node) public targetShape: Node = null;
    initialPosition: Vec3 = new Vec3();
    isDragging: boolean = true;
    isInShape: boolean = false;
    isRightShape: boolean = false;
    isDone: boolean = true;
    @property number : number = 1;
    //@property targetPosition: Vec3 = new Vec3();
    //@property canStayPosition2: Vec3[] = [];
    @property(Vec3) public canStayPosition: Vec3[] = [];

    // let targetArray: Node[] = [];

    @property(Node) Position: Node[] = [];
    
 

    start() {
        this.initialPosition.set(this.node.worldPosition);
        this.node.children.forEach(child => {
            //console.log(child.name);
            this.Position.push(child);
        });
        // Đăng ký sự kiện nhấn chuột
        this.node.on(Node.EventType.TOUCH_START, this.onMouseDown, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onMouseUp, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseUp, this);
    }

    expandBoundingBox(box: Rect, expandBy: number): Rect {
        // Tăng chiều rộng và chiều cao của BoundingBox
        box.width += expandBy * 2;
        box.height += expandBy * 2;

        // Điều chỉnh lại vị trí để trung tâm của bounding box không thay đổi
        box.x -= expandBy;
        box.y -= expandBy;

        return box;
    }

    onMouseDown(event: EventTouch) {
        // Kiểm tra nếu layer của sprite là "target"
        //if (this.node.layer === Layers.nameToLayer('target')) {
        //console.log('Sprite with layer "target" is clicked!');
        //console.log(1);
        this.isDragging = true;
        this.node.scale = new Vec3(1, 1, 1);
        const delta = event.getDelta();
        if (!this.isInShape)
            this.node.setPosition(this.node.position.x + delta.x, this.node.position.y + delta.y + 200);
        else
            this.node.setPosition(this.node.position.x + delta.x, this.node.position.y + delta.y);
        //}
    }

    proximityThreshold = 30;
    onMouseMove(event: EventTouch) {
        //console.log(2);
        if (this.isDragging) {
            // Di chuyển sprite theo chuột
            const delta = event.getDelta();

            this.node.setPosition(this.node.position.x + delta.x, this.node.position.y + delta.y);
            this.node.scale = new Vec3(1, 1, 1);


            const movingBox = this.node.getComponent(UITransform).getBoundingBoxToWorld();
            const expandedBox = this.expandBoundingBox(movingBox, 10);
            const targetBox = this.targetShape.getComponent(UITransform).getBoundingBoxToWorld();
            const expandedBox2 = this.expandBoundingBox(targetBox, 20);

            for (let j = 0; j < this.Position.length; j++) {
                const nodeB = this.Position[j];
                if (this.isBoxInside(nodeB.getComponent(UITransform).getBoundingBoxToWorld(), expandedBox2)) {
                    nodeB.active = false;
                }
                else {
                    nodeB.active = true;
                }
            }

            for (let j = 0; j < GameController.instance.Position.length; j++) {
                const nodeB = GameController.instance.Position[j];
                if (this.isBoxInside(nodeB.getComponent(UITransform).getBoundingBoxToWorld(), expandedBox)) {
                    nodeB.active = true;
                }
                else {
                    nodeB.active = false;
                }
            }

            //////////////////////////////// đây là 2 vòng for ///////////////////////////////////
            // for (let i = 0; i < this.Position.length; i++) {
            //     const nodeA = this.Position[i];

            //     for (let j = 0; j < GameController.instance.Position.length; j++) {
            //         const nodeB = GameController.instance.Position[j];

            //         // Lấy world position của nodeA và nodeB
            //         const worldPosA = nodeA.getWorldPosition();
            //         const worldPosB = nodeB.getWorldPosition();

            //         // Tính khoảng cách giữa hai node trong không gian thế giới
            //         const distance = worldPosA.subtract(worldPosB).length();
            //         // console.log(`Khoảng cách giữa ${nodeA.name} và ${nodeB.name}: ${distance}`);

            //         // Kiểm tra nếu khoảng cách nhỏ hơn ngưỡng
            //         if (distance < this.proximityThreshold) {
            //             console.log(`${nodeA.name} và ${nodeB.name} ở gần nhau với khoảng cách: ${distance}`);
            //             nodeB.active = true;
            //             nodeA.active = false;
            //         }
            //         else {
            //             nodeB.active = false;
            //             //nodeA.active = true;
            //         }
            //     }
            // }
        }
    }

    onMouseUp(event: EventTouch) {
        //console.log(3);
        if (this.isDragging) {
            this.isDragging = false;
            const movingBox = this.node.getComponent(UITransform).getBoundingBoxToWorld();
            const targetBox = this.targetShape.getComponent(UITransform).getBoundingBoxToWorld();
            const expandedBox = this.expandBoundingBox(targetBox, 20);
            // console.log(targetBox);
            // console.log(movingBox);
            //Kiểm tra xem movingBox có nằm hoàn toàn trong targetBox hay không
            if (this.isBoxInside(movingBox, expandedBox)) {
                console.log("The shape can fit into the target shape.");
                this.isInShape = true;
                this.setNearestPosition(this.node.position);
            
            } else {
                console.log("The shape cannot fit into the target shape.");
                this.isInShape = false;
                this.node.scale = new Vec3(0.9, 0.9, 0.9)
                this.node.setWorldPosition(this.initialPosition);
                if (this.isRightShape) {
                    this.isRightShape = false;
                    GameController.instance.minusScore();
                }
            }

            for (let j = 0; j < this.Position.length; j++) {
                const nodeB = this.Position[j];
                nodeB.active = false;
            }
            for (let j = 0; j < GameController.instance.Position.length; j++) {
                const nodeB = GameController.instance.Position[j];
                nodeB.active = false;
            }
        }
    }

    public setNearestPosition(currentPosition: Vec3): void {
        if (this.canStayPosition.length === 0) return;

        let nearestPosition = this.canStayPosition[0];
        let minDistance = Vec3.distance(currentPosition, nearestPosition);

        for (let i = 1; i < this.canStayPosition.length; i++) {
            const position = this.canStayPosition[i];
            const distance = Vec3.distance(currentPosition, position);
            
            if (distance < minDistance) {
                nearestPosition = position;
                minDistance = distance;
                if (i == 0 && !this.isRightShape) {
                    this.isRightShape == true;
                    GameController.instance.addScore();
                }
            }

            
        }

        // Đặt vị trí hiện tại bằng vị trí gần nhất tìm được
        this.node.setPosition(nearestPosition);
    }

    isBoxInside(innerBox: Rect, outerBox: Rect): boolean {
        // Kiểm tra xem tất cả các cạnh của innerBox có nằm trong outerBox hay không
        return (
            innerBox.xMin >= outerBox.xMin &&
            innerBox.xMax <= outerBox.xMax &&
            innerBox.yMin >= outerBox.yMin &&
            innerBox.yMax <= outerBox.yMax
        );
    }
}
