using MovieManagement.Domain.Entities.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MovieManagement.Domain.Entities.Class
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Directors { get; set; } = string.Empty;
        public string Actors { get; set; } = string.Empty;
        [JsonPropertyName("Release Date")]
        public DateTime ReleaseDate { get; set; }
        public Genre Genre { get; set; }
        [NotMapped]
        [JsonPropertyName("Running Time (secs)")]
        public int RuntimeSeconds { get; set; }

        public TimeSpan Runtime { get; set; }
        public string? Plot { get; set; }
        public decimal? Rating { get; set; }

        [JsonPropertyName("Image URL")]
        public string? ImageUrl { get; set; }
    }
}
