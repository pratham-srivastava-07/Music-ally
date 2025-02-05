type MusicMessageType = 'instrument' | 'track' | 'cursor' | 'error';

interface BaseMessage {
    type: MusicMessageType;
    timestamp?: number;
    trackId?: string;
}

interface InstrumentMessage extends BaseMessage {
    type: 'instrument';
    instrumentId: string;
    settings?: {
        volume?: number;  // 0-1
        pan?: number;     // -1 to 1
    };
}

interface TrackMessage extends BaseMessage {
    type: 'track';
    action: 'add' | 'remove' | 'update';
    name?: string;
    isMuted?: boolean;
    isSolo?: boolean;
}

interface CursorMessage extends BaseMessage {
    type: 'cursor';
    position: number;    // Position in ticks/beats
}

interface ErrorMessage extends BaseMessage {
    type: 'error';
    message: string;
}

type MusicCollabMessage = InstrumentMessage | TrackMessage | CursorMessage | ErrorMessage;

function isValidMessageType(type: string): type is MusicMessageType {
    return ['instrument', 'track', 'cursor', 'error'].includes(type);
}

export function validateMusicMessage(data: string): {
    message?: MusicCollabMessage;
    error?: string;
    isValid: boolean;
} {
    try {
        const parsedValue = JSON.parse(data);

        if (!parsedValue.type) {
            return { isValid: false, error: "Missing message type" };
        }

        if (!isValidMessageType(parsedValue.type)) {
            return { isValid: false, error: "Invalid message type" };
        }

        switch (parsedValue.type) {
            case 'instrument':
                if (typeof parsedValue.instrumentId !== 'string') {
                    return { isValid: false, error: "Invalid instrument ID" };
                }
                if (parsedValue.settings) {
                    if (parsedValue.settings.volume !== undefined && 
                        (typeof parsedValue.settings.volume !== 'number' || 
                         parsedValue.settings.volume < 0 || 
                         parsedValue.settings.volume > 1)) {
                        return { isValid: false, error: "Invalid volume setting" };
                    }
                    if (parsedValue.settings.pan !== undefined && 
                        (typeof parsedValue.settings.pan !== 'number' || 
                         parsedValue.settings.pan < -1 || 
                         parsedValue.settings.pan > 1)) {
                        return { isValid: false, error: "Invalid pan setting" };
                    }
                }
                break;

            case 'track':
                if (!['add', 'remove', 'update'].includes(parsedValue.action)) {
                    return { isValid: false, error: "Invalid track action" };
                }
                if (parsedValue.name !== undefined && typeof parsedValue.name !== 'string') {
                    return { isValid: false, error: "Invalid track name" };
                }
                if (parsedValue.isMuted !== undefined && typeof parsedValue.isMuted !== 'boolean') {
                    return { isValid: false, error: "Invalid mute setting" };
                }
                if (parsedValue.isSolo !== undefined && typeof parsedValue.isSolo !== 'boolean') {
                    return { isValid: false, error: "Invalid solo setting" };
                }
                break;

            case 'cursor':
                if (typeof parsedValue.position !== 'number' || parsedValue.position < 0) {
                    return { isValid: false, error: "Invalid cursor position" };
                }
                break;

            case 'error':
                if (typeof parsedValue.message !== 'string') {
                    return { isValid: false, error: "Invalid error message" };
                }
                break;
        }

        if (!parsedValue.timestamp) {
            parsedValue.timestamp = Date.now();
        }

        return {
            isValid: true,
            message: parsedValue as MusicCollabMessage
        };

    } catch (e) {
        return {
            isValid: false,
            error: `Failed to parse message: ${e instanceof Error ? e.message : 'Unknown error'}`
        };
    }
}