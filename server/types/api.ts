export {
    newResponse,
    ApiResponse
}

interface ApiResponse {
    ok: boolean;
    status: number;
    statusText: string;
    data?: any;
}

function newResponse(res: ApiResponse) {
    return res
}