package be.ucll.retake.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class SteamService {

    private final RestClient restClient = RestClient.create();

    public Integer getCurrentPlayers(Integer steamAppid) {
        try {
            String url =
                    "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid="
                    + steamAppid;

            Map body = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(Map.class);

            Map response = (Map) body.get("response");

            Number playerCount =
                    (Number) response.get("player_count");

            return playerCount.intValue();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}