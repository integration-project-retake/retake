package be.ucll.retake.exception;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        int status,
        String error,
        Map<String, String> fields
) {
    public ApiError(int status, String error) {
        this(status, error, null);
    }
}