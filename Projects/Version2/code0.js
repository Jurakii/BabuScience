gdjs.Untitled_32sceneCode = {};
gdjs.Untitled_32sceneCode.GDRocketBabuObjects1= [];
gdjs.Untitled_32sceneCode.GDRocketBabuObjects2= [];
gdjs.Untitled_32sceneCode.GDPipeObjects1= [];
gdjs.Untitled_32sceneCode.GDPipeObjects2= [];
gdjs.Untitled_32sceneCode.GDPipe2Objects1= [];
gdjs.Untitled_32sceneCode.GDPipe2Objects2= [];
gdjs.Untitled_32sceneCode.GDTextObjects1= [];
gdjs.Untitled_32sceneCode.GDTextObjects2= [];

gdjs.Untitled_32sceneCode.conditionTrue_0 = {val:false};
gdjs.Untitled_32sceneCode.condition0IsTrue_0 = {val:false};
gdjs.Untitled_32sceneCode.condition1IsTrue_0 = {val:false};
gdjs.Untitled_32sceneCode.condition2IsTrue_0 = {val:false};
gdjs.Untitled_32sceneCode.condition3IsTrue_0 = {val:false};


gdjs.Untitled_32sceneCode.eventsList0 = function(runtimeScene) {

{



}


{

gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.Untitled_32sceneCode.GDRocketBabuObjects1);

gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = false;
gdjs.Untitled_32sceneCode.condition1IsTrue_0.val = false;
gdjs.Untitled_32sceneCode.condition2IsTrue_0.val = false;
{
gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) > -(5);
}if ( gdjs.Untitled_32sceneCode.condition0IsTrue_0.val ) {
{
gdjs.Untitled_32sceneCode.condition1IsTrue_0.val = gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, "Left");
}if ( gdjs.Untitled_32sceneCode.condition1IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i].getY() > 0 ) {
        gdjs.Untitled_32sceneCode.condition2IsTrue_0.val = true;
        gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[k] = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length = k;}}
}
if (gdjs.Untitled_32sceneCode.condition2IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(-(10));
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.Untitled_32sceneCode.GDRocketBabuObjects1);

gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = false;
gdjs.Untitled_32sceneCode.condition1IsTrue_0.val = false;
gdjs.Untitled_32sceneCode.condition2IsTrue_0.val = false;
{
gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = gdjs.evtTools.input.isKeyPressed(runtimeScene, "Space");
}if ( gdjs.Untitled_32sceneCode.condition0IsTrue_0.val ) {
{
gdjs.Untitled_32sceneCode.condition1IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) > -(5);
}if ( gdjs.Untitled_32sceneCode.condition1IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i].getY() > 0 ) {
        gdjs.Untitled_32sceneCode.condition2IsTrue_0.val = true;
        gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[k] = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length = k;}}
}
if (gdjs.Untitled_32sceneCode.condition2IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(-(10));
}}

}


{



}


{


gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = false;
{
gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
}if (gdjs.Untitled_32sceneCode.condition0IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(1).setNumber(100);
}{runtimeScene.getVariables().getFromIndex(2).setNumber(100);
}{runtimeScene.getVariables().get("Offset3").setNumber(100);
}{runtimeScene.getVariables().get("Offset4").setNumber(100);
}{runtimeScene.getVariables().get("PipeX").setNumber(gdjs.evtTools.window.getGameResolutionWidth(runtimeScene));
}{runtimeScene.getVariables().get("Pipe2X").setNumber(gdjs.evtTools.window.getGameResolutionWidth(runtimeScene) + gdjs.evtTools.window.getGameResolutionWidth(runtimeScene) / 2 + 50);
}{gdjs.evtTools.window.centerWindow(runtimeScene);
}{gdjs.evtTools.window.setAdaptGameResolutionAtRuntime(runtimeScene, true);
}}

}


{


gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = false;
{
gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = gdjs.evtTools.common.logicalNegation(false);
}if (gdjs.Untitled_32sceneCode.condition0IsTrue_0.val) {
gdjs.copyArray(runtimeScene.getObjects("Pipe"), gdjs.Untitled_32sceneCode.GDPipeObjects1);
gdjs.copyArray(runtimeScene.getObjects("Pipe2"), gdjs.Untitled_32sceneCode.GDPipe2Objects1);
gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.Untitled_32sceneCode.GDRocketBabuObjects1);
{runtimeScene.getVariables().getFromIndex(0).add(0.5);
}{for(var i = 0, len = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length ;i < len;++i) {
    gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i].setY(gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i].getY() + (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(0))));
}
}{for(var i = 0, len = gdjs.Untitled_32sceneCode.GDPipeObjects1.length ;i < len;++i) {
    gdjs.Untitled_32sceneCode.GDPipeObjects1[i].drawRectangle(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")), -(10), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) + 100, gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(1)) - 100);
}
}{for(var i = 0, len = gdjs.Untitled_32sceneCode.GDPipe2Objects1.length ;i < len;++i) {
    gdjs.Untitled_32sceneCode.GDPipe2Objects1[i].drawRectangle(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")), -(10), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")) + 100, gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(2)) - 100);
}
}{for(var i = 0, len = gdjs.Untitled_32sceneCode.GDPipeObjects1.length ;i < len;++i) {
    gdjs.Untitled_32sceneCode.GDPipeObjects1[i].drawRectangle(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")), gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(1)) + 100, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) + 100, gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) + 10);
}
}{for(var i = 0, len = gdjs.Untitled_32sceneCode.GDPipe2Objects1.length ;i < len;++i) {
    gdjs.Untitled_32sceneCode.GDPipe2Objects1[i].drawRectangle(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")), gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(2)) + 100, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")) + 100, gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) + 10);
}
}{runtimeScene.getVariables().get("PipeX").sub(5);
}{runtimeScene.getVariables().get("Pipe2X").sub(5);
}}

}


{


gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = false;
{
gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) > 0;
}if (gdjs.Untitled_32sceneCode.condition0IsTrue_0.val) {
gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.Untitled_32sceneCode.GDRocketBabuObjects1);
{for(var i = 0, len = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length ;i < len;++i) {
    gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i].setAnimationFrame(0);
}
}}

}


{


gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = false;
{
gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) <= 0;
}if (gdjs.Untitled_32sceneCode.condition0IsTrue_0.val) {
gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.Untitled_32sceneCode.GDRocketBabuObjects1);
{for(var i = 0, len = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length ;i < len;++i) {
    gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i].setAnimationFrame(1);
}
}}

}


{


gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = false;
{
gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) <= -(100);
}if (gdjs.Untitled_32sceneCode.condition0IsTrue_0.val) {
{runtimeScene.getVariables().get("PipeX").setNumber(gdjs.evtTools.window.getGameResolutionWidth(runtimeScene));
}{runtimeScene.getVariables().getFromIndex(1).setNumber(gdjs.randomInRange(-(250), 250));
}}

}


{


gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = false;
{
gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")) <= -(100);
}if (gdjs.Untitled_32sceneCode.condition0IsTrue_0.val) {
{runtimeScene.getVariables().get("Pipe2X").setNumber(gdjs.evtTools.window.getGameResolutionWidth(runtimeScene));
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.Untitled_32sceneCode.GDRocketBabuObjects1);

gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = false;
gdjs.Untitled_32sceneCode.condition1IsTrue_0.val = false;
gdjs.Untitled_32sceneCode.condition2IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i].getX() > gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) ) {
        gdjs.Untitled_32sceneCode.condition0IsTrue_0.val = true;
        gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[k] = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length = k;}if ( gdjs.Untitled_32sceneCode.condition0IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i].getX() < gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) + 100 ) {
        gdjs.Untitled_32sceneCode.condition1IsTrue_0.val = true;
        gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[k] = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length = k;}if ( gdjs.Untitled_32sceneCode.condition1IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i].getY() < gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(1)) - 100 ) {
        gdjs.Untitled_32sceneCode.condition2IsTrue_0.val = true;
        gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[k] = gdjs.Untitled_32sceneCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length = k;}}
}
if (gdjs.Untitled_32sceneCode.condition2IsTrue_0.val) {
gdjs.copyArray(runtimeScene.getObjects("Text"), gdjs.Untitled_32sceneCode.GDTextObjects1);
{for(var i = 0, len = gdjs.Untitled_32sceneCode.GDTextObjects1.length ;i < len;++i) {
    gdjs.Untitled_32sceneCode.GDTextObjects1[i].setString("HIT");
}
}}

}


};

gdjs.Untitled_32sceneCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.Untitled_32sceneCode.GDRocketBabuObjects1.length = 0;
gdjs.Untitled_32sceneCode.GDRocketBabuObjects2.length = 0;
gdjs.Untitled_32sceneCode.GDPipeObjects1.length = 0;
gdjs.Untitled_32sceneCode.GDPipeObjects2.length = 0;
gdjs.Untitled_32sceneCode.GDPipe2Objects1.length = 0;
gdjs.Untitled_32sceneCode.GDPipe2Objects2.length = 0;
gdjs.Untitled_32sceneCode.GDTextObjects1.length = 0;
gdjs.Untitled_32sceneCode.GDTextObjects2.length = 0;

gdjs.Untitled_32sceneCode.eventsList0(runtimeScene);
return;

}

gdjs['Untitled_32sceneCode'] = gdjs.Untitled_32sceneCode;
