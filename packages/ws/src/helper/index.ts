type MessageType = 'edit' | 'cursor' | 'selection' | 'error';


interface BaseMessage {
    type: MessageType
    timestamp?: number
}

interface EditMessage extends BaseMessage {
    type: 'edit',
    content: string
}

interface Cursor extends BaseMessage {
    type: 'cursor',
    position: number
}


interface ErrorMessage extends BaseMessage {
    type: 'error';
    message: string;
}

type CodeEditorMessage = EditMessage | Cursor | ErrorMessage

// validate if contains these types only

function isValid(type: string): type is MessageType {
    return ['error', 'cursor', 'selection', 'edit'].includes(type)
}

export function validateMessage(data: string): {message?: CodeEditorMessage; error?: string; isMessageValid?: boolean} {
    try {
        const parsedValue = JSON.parse(data)

        if(!parsedValue.type) {
            return {isMessageValid: false, error: "Data not parsed correctly"}
        }

        if(!isValid(parsedValue.type)) {
            return {isMessageValid: false, error: "Incorrect Message type"}
        }

        switch(parsedValue.type) {
            case 'edit':
                if (typeof parsedValue.content !== 'string') {
                    return { isMessageValid: false, error: 'Edit message must have content as string' };
                }
                if (parsedValue.content.length > 50000) { // Example max length
                    return { isMessageValid: false, error: 'Content exceeds maximum length' };
                }
                break;
            case 'cursor':
                if (typeof parsedValue.position !== 'number') {
                    return { isMessageValid: false, error: 'Cursor message must have position as number' };
                }
                break;
        }
        
        if(parsedValue.timestamp) {
            parsedValue.timestamp = Date.now()
        }

        return {isMessageValid: true, message: parsedValue as CodeEditorMessage}
        
    } catch(e) {
        return {isMessageValid: true, error: JSON.stringify(e)}
    }
}