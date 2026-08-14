package be.ucll.retake.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTypeMismatch(
            MethodArgumentTypeMismatchException exception
    ) {
        String message =
                "Invalid value for " + exception.getName();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        new ApiError(
                                400,
                                message
                        )
                );
    }

    // 404 - resource not found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(
            ResourceNotFoundException exception
    ) {
        ApiError error = new ApiError(
                HttpStatus.NOT_FOUND.value(),
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error);
    }

    // 400 - bad input / business validation
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(
            IllegalArgumentException exception
    ) {
        ApiError error = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }

    // 403 - user is not allowed to perform action
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiError> handleSecurityException(
            SecurityException exception
    ) {
        ApiError error = new ApiError(
                HttpStatus.FORBIDDEN.value(),
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(error);
    }

    // 400 - @Valid DTO validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        Map<String, String> fields =
                new LinkedHashMap<>();

        for (
                FieldError fieldError :
                exception.getBindingResult().getFieldErrors()
        ) {
            fields.put(
                    fieldError.getField(),
                    fieldError.getDefaultMessage()
            );
        }

        ApiError error = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                fields
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiError> handleUnauthorized(
            UnauthorizedException exception
    ) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                        new ApiError(
                                401,
                                exception.getMessage()
                        )
                );
    }

    // 500 - everything unexpected
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpectedException(
            Exception exception
    ) {
        // Log backend details, but DO NOT send them to fronten
        exception.printStackTrace();

        ApiError error = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal server error"
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

}