import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/MainPage.css';
import { faRotate, faCaretLeft, faCaretRight, faClose, faPlus, faThumbTack } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { getData, saveData } from '../storage';
export default function MainPage(props) {
    const imgRef = useRef(null);
    const [memos, setMemos] = useState([]);
    const [selected, setSelected] = useState(-1);

    useEffect(()=> {
        if(memos.length === 0){
            const newMemos = getData("memos");
            if(newMemos !== null) setMemos(newMemos);
        }
    }, []);

    const encodingToBase64 = (files) => {
        if(files === undefined || files === null) return;
        if(files.length === 0) return;
        const file = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64data = reader.result;
            props.onBackgroundChange(base64data);
        }
    }

    const moveFront = (targetId) => {
        let targetIndex = -1;
        for(let i = 0; i < memos.length; i ++){
            if(memos[i].id === targetId){
                targetIndex = i;
                break;
            }
        }
        if(targetIndex <= 0) return;
        const newMemos = [];
        for(let i = 0; i < memos.length; i ++){
            if(i === targetIndex-1){
                newMemos.push(memos[targetIndex]);
                newMemos.push(memos[targetIndex-1]);
            } else if(i !== targetIndex){
                newMemos.push(memos[i]);
            }
        }
        setMemos(newMemos);
        saveData("memos", newMemos);
    }

    const moveBack = (targetId) => {
        let targetIndex = -1;
        for(let i = 0; i < memos.length; i ++){
            if(memos[i].id === targetId){
                targetIndex = i;
                break;
            }
        }
        if(targetIndex >= memos.length-1) return;
        const newMemos = [];
        for(let i = 0; i < memos.length; i ++){
            if(i === targetIndex){
                newMemos.push(memos[targetIndex+1]);
                newMemos.push(memos[targetIndex]);
            } else if(i !== targetIndex+1){
                newMemos.push(memos[i]);
            }
        }
        setMemos(newMemos);
        saveData("memos", newMemos);
    }

    const togglePinMemo = (targetId) => {
        const newMemos = [];
        for(let i = 0; i < memos.length; i ++){
            if(memos[i].id === targetId){
                memos[i].pinned = !memos[i].pinned;
            }
            newMemos.push(memos[i]);
        }
        setMemos(newMemos);
        saveData("memos", newMemos);
    }

    const onCreate = () => {
        let generatedId = 0;
        for(let i = 0; i < memos.length; i ++){
            if(generatedId < memos[i].id){
                generatedId = memos[i].id;
            }
        }
        generatedId ++;
        const newMemos = [...memos, {id: generatedId, title: "New memo", content: "", pinned: false }];
        saveData("memos", newMemos);
        setMemos(newMemos);
    }

    const onDelete = (targetId) => {
        const newMemos = memos.filter((it) => it.id !== targetId);
        saveData("memos", newMemos);
        setMemos(newMemos);
    };

    const onEdit = (targetId, title, content) => {
        const newMemos = memos.map((it) => it.id === targetId ? {id:targetId,title:title,content:content} : it);
        saveData("memos", newMemos);
        setMemos(newMemos);
    }

    const renderMemos = () => {
        const result = [];
        for (let i = 0; i < memos.length; i++) {
            if(memos[i].pinned)
                result.push(<div key={i} className="memo" style={{ maxHeight: selected === memos[i].id ? "35vh" : "4.9vh" }}>
                    <div className="memo-header">
                        <div className="memo-title-text">
                            <input type="text" value={memos[i].title} style={{ width: "100%", color: props.color }} 
                                onClick={(_) => setSelected(i)}
                                onChange={(e) => onEdit(memos[i].id, e.target.value, memos[i].content)} />
                        </div>
                        <div className="memo-header-btns">
                            <FontAwesomeIcon className="memo-move-back" icon={faCaretLeft} onClick={()=>moveFront(memos[i].id)}/>
                            <FontAwesomeIcon className="memo-move-front" icon={faCaretRight} onClick={()=>moveBack(memos[i].id)}/>
                            <FontAwesomeIcon className="memo-pin-btn" icon={faThumbTack} style={{color: "skyblue"}} onClick={()=>togglePinMemo(memos[i].id)}/>
                            <FontAwesomeIcon className="memo-close-btn" icon={faClose} onClick={()=>onDelete(memos[i].id)}/>
                        </div>
                    </div>
                    <textarea className="memo-body"
                    value={memos[i].content} 
                    style={{color: props.color}}
                    onChange={(e) => onEdit(memos[i].id, memos[i].title, e.target.value)}/>
                </div>);
        }
        for (let i = 0; i < memos.length; i++) {
            if(!memos[i].pinned)
                result.push(<div key={i} className="memo" style={{ maxHeight: selected === memos[i].id ? "35vh" : "4.9vh" }}>
                    <div className="memo-header">
                        <div className="memo-title-text">
                            <input type="text" value={memos[i].title} style={{ width: "100%", color: props.color }} 
                                onClick={(_) => setSelected(memos[i].id)}
                                onChange={(e) => onEdit(memos[i].id, e.target.value, memos[i].content)} />
                        </div>
                        <div className="memo-header-btns">
                            <FontAwesomeIcon className="memo-move-back" icon={faCaretLeft} onClick={()=>moveFront(memos[i].id)}/>
                            <FontAwesomeIcon className="memo-move-front" icon={faCaretRight} onClick={()=>moveBack(memos[i].id)}/>
                            <FontAwesomeIcon className="memo-pin-btn" icon={faThumbTack} onClick={()=>togglePinMemo(memos[i].id)}/>
                            <FontAwesomeIcon className="memo-close-btn" icon={faClose} onClick={()=>onDelete(memos[i].id)}/>
                        </div>
                    </div>
                    <textarea className="memo-body"
                    value={memos[i].content} 
                    style={{color: props.color}}
                    onChange={(e) => onEdit(memos[i].id, memos[i].title, e.target.value)}/>
                </div>);
        }

        return result;
    }

    return <>
        <div className="main-page-frame">
            <div className="change-background" onClick={() => imgRef.current.click()}>
                Background<FontAwesomeIcon icon={faRotate} />
                <input ref={imgRef} type="file" style={{display:"none"}} onChange={(e)=>encodingToBase64(e.target.files)}/>
            </div>
            <div className="memo-wrapper">
                {renderMemos()}
            </div>
            <div className="add-memo" onClick={onCreate}>
                    <FontAwesomeIcon icon={faPlus} />
                </div>
        </div>
    </>;
}