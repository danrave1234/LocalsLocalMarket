package org.localslocalmarket.web;

import java.util.Map;

import org.localslocalmarket.model.User;
import org.localslocalmarket.repo.UserRepository;
import org.localslocalmarket.security.JwtService;
import org.localslocalmarket.web.dto.AuthDtos;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Validated AuthDtos.RegisterRequest req){
        if(users.existsByEmail(req.email())){
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }
        User u = new User();
        u.setEmail(req.email().toLowerCase());
        u.setPasswordHash(encoder.encode(req.password()));
        u.setName(req.name());
        u.setRole(User.Role.SELLER);
        users.save(u);
        String token = jwt.generate(u.getEmail(), Map.of("role", u.getRole().name(), "uid", u.getId()));
        return ResponseEntity.ok(new AuthDtos.AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated AuthDtos.LoginRequest req){
        return users.findByEmail(req.email().toLowerCase())
                .filter(u -> encoder.matches(req.password(), u.getPasswordHash()))
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(new AuthDtos.AuthResponse(
                        jwt.generate(u.getEmail(), Map.of("role", u.getRole().name(), "uid", u.getId())))))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }
}
