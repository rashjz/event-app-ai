package com.example.eventsapp.service;

import com.example.eventsapp.model.User;
import com.example.eventsapp.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oauth2User.getAttributes();

        String email = null;
        String name = null;
        String providerId = null;
        String profilePictureUrl = null;

        if ("google".equals(registrationId)) {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
            providerId = (String) attributes.get("id");
            profilePictureUrl = (String) attributes.get("picture");
        } else if ("facebook".equals(registrationId)) {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
            providerId = (String) attributes.get("id");
            @SuppressWarnings("unchecked")
            Map<String, Object> picture = (Map<String, Object>) attributes.get("picture");
            if (picture != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) picture.get("data");
                if (data != null) {
                    profilePictureUrl = (String) data.get("url");
                }
            }
        }

        if (email != null) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = new User(email, null, registrationId, providerId, name);
                user.setProfilePictureUrl(profilePictureUrl);
                userRepository.save(user);
            } else {
                // Update user info if needed
                user.setProvider(registrationId);
                user.setProviderId(providerId);
                user.setName(name);
                user.setProfilePictureUrl(profilePictureUrl);
                userRepository.save(user);
            }
        }

        return oauth2User;
    }
}
